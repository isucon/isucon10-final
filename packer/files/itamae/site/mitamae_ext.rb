MItamae::RecipeContext.class_eval do
  ROLES_DIR = File.expand_path("../../roles", __FILE__)
  def include_role(name)
    names = name.split("::")

    names << "default" if names.length == 1
    names[-1] += ".rb"

    common_candidates = [
      File.join(ROLES_DIR, *names),
    ]
    candidates = [
      *common_candidates,
    ]

    candidates.each do |candidate|
      if File.exist?(candidate)
        include_recipe(candidate)
        return
      end
    end
    raise "Role #{name} couldn't found"
  end

  COOKBOOKS_DIR = File.expand_path("../../cookbooks", __FILE__)
  def include_cookbook(name)
    names = name.split("::")

    names << "default" if names.length == 1
    names[-1] += ".rb"

    common_candidates = [
      File.join(COOKBOOKS_DIR, *names),
    ]
    candidates = [
      *common_candidates,
    ]
    candidates.each do |candidate|
      if File.exist?(candidate)
        include_recipe(candidate)
        return
      end
    end
    raise "Cookbook #{name} couldn't found"
  end
end
