<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/services/admin/benchmark.proto

namespace Xsuportal\Proto\Services\Admin;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>xsuportal.proto.services.admin.CancelBenchmarkJobResponse</code>
 */
class CancelBenchmarkJobResponse extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.BenchmarkJob job = 1;</code>
     */
    private $job = null;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type \Xsuportal\Proto\Resources\BenchmarkJob $job
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Xsuportal\Services\Admin\Benchmark::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.BenchmarkJob job = 1;</code>
     * @return \Xsuportal\Proto\Resources\BenchmarkJob
     */
    public function getJob()
    {
        return $this->job;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.BenchmarkJob job = 1;</code>
     * @param \Xsuportal\Proto\Resources\BenchmarkJob $var
     * @return $this
     */
    public function setJob($var)
    {
        GPBUtil::checkMessage($var, \Xsuportal\Proto\Resources\BenchmarkJob::class);
        $this->job = $var;

        return $this;
    }

}

