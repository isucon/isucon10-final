<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/services/common/me.proto

namespace Xsuportal\Proto\Services\Common;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>xsuportal.proto.services.common.GetCurrentSessionResponse</code>
 */
class GetCurrentSessionResponse extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Team team = 1;</code>
     */
    private $team = null;
    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contestant contestant = 2;</code>
     */
    private $contestant = null;
    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 4;</code>
     */
    private $contest = null;
    /**
     * Generated from protobuf field <code>string push_vapid_key = 6;</code>
     */
    private $push_vapid_key = '';

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type \Xsuportal\Proto\Resources\Team $team
     *     @type \Xsuportal\Proto\Resources\Contestant $contestant
     *     @type \Xsuportal\Proto\Resources\Contest $contest
     *     @type string $push_vapid_key
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Xsuportal\Services\Common\Me::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Team team = 1;</code>
     * @return \Xsuportal\Proto\Resources\Team
     */
    public function getTeam()
    {
        return $this->team;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Team team = 1;</code>
     * @param \Xsuportal\Proto\Resources\Team $var
     * @return $this
     */
    public function setTeam($var)
    {
        GPBUtil::checkMessage($var, \Xsuportal\Proto\Resources\Team::class);
        $this->team = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contestant contestant = 2;</code>
     * @return \Xsuportal\Proto\Resources\Contestant
     */
    public function getContestant()
    {
        return $this->contestant;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contestant contestant = 2;</code>
     * @param \Xsuportal\Proto\Resources\Contestant $var
     * @return $this
     */
    public function setContestant($var)
    {
        GPBUtil::checkMessage($var, \Xsuportal\Proto\Resources\Contestant::class);
        $this->contestant = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 4;</code>
     * @return \Xsuportal\Proto\Resources\Contest
     */
    public function getContest()
    {
        return $this->contest;
    }

    /**
     * Generated from protobuf field <code>.xsuportal.proto.resources.Contest contest = 4;</code>
     * @param \Xsuportal\Proto\Resources\Contest $var
     * @return $this
     */
    public function setContest($var)
    {
        GPBUtil::checkMessage($var, \Xsuportal\Proto\Resources\Contest::class);
        $this->contest = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>string push_vapid_key = 6;</code>
     * @return string
     */
    public function getPushVapidKey()
    {
        return $this->push_vapid_key;
    }

    /**
     * Generated from protobuf field <code>string push_vapid_key = 6;</code>
     * @param string $var
     * @return $this
     */
    public function setPushVapidKey($var)
    {
        GPBUtil::checkString($var, True);
        $this->push_vapid_key = $var;

        return $this;
    }

}

