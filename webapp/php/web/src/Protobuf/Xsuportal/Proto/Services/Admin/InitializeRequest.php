<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/services/admin/initialize.proto

namespace Xsuportal\Proto\Services\Admin;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>xsuportal.proto.services.admin.InitializeRequest</code>
 */
class InitializeRequest extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 1;</code>
     */
    private $contest = null;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type \Xsuportal\Proto\Resources\Contest $contest
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Xsuportal\Services\Admin\Initialize::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 1;</code>
     * @return \Xsuportal\Proto\Resources\Contest
     */
    public function getContest()
    {
        return $this->contest;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 1;</code>
     * @param \Xsuportal\Proto\Resources\Contest $var
     * @return $this
     */
    public function setContest($var)
    {
        GPBUtil::checkMessage($var, \Xsuportal\Proto\Resources\Contest::class);
        $this->contest = $var;

        return $this;
    }

}

