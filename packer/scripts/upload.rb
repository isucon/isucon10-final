require 'json'
require 'aws-sdk-s3'

BUCKET = 'isucon10-machine-images'
PREFIX = 'final/'

manifest = JSON.parse(File.read(ARGV[0]))
builds = manifest.fetch('builds')

ami = builds.find { |_| _.fetch('name') == 'amazon-ebs' }
qemu =  builds.find { |_| _.fetch('name') == 'qemu' }
manifest['name'] = name = qemu.fetch('files')[0].fetch('name')
manifest['ami_id'] = ami.fetch('artifact_id').split(?:,2)[1]

family = manifest['family'] = ami.fetch('custom_data').fetch('family')
manifest_key =  manifest['manifest_key'] = "#{PREFIX}#{family}/#{name}.json"
qcow2_path = "output/#{name}/#{name}"
qcow2_key = manifest['qcow2_key'] = "#{PREFIX}#{family}/#{name}.qcow2"

s3 = Aws::S3::Client.new(use_dualstack_endpoint: true)

puts "==> loading manifest "
puts "    #{manifest.to_json}"

puts "==> uploading qcow2"
puts "  * Source:      #{qcow2_path}"
puts "  * Destination: s3://#{BUCKET}/#{qcow2_key}"
checksum = manifest['qcow2_sha256'] = Digest::SHA256.file(qcow2_path)
puts "  * Checksum: #{checksum}"
File.open(qcow2_path, 'rb') do |io|
  s3.put_object(bucket: BUCKET, key: qcow2_key, body: io)
end

puts "==> uploading manifest"
puts "  * Destination: s3://#{BUCKET}/#{manifest_key}"
s3.put_object(bucket: BUCKET, key: manifest_key, body: JSON.pretty_generate(manifest))
File.write ARGV[0], JSON.pretty_generate(manifest)
