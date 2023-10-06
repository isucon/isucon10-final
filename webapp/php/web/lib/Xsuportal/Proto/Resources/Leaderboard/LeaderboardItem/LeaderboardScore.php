<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/resources/leaderboard.proto

namespace Xsuportal\Proto\Resources\Leaderboard\LeaderboardItem;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore</code>
 */
class LeaderboardScore extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>int64 score = 1;</code>
     */
    private $score = 0;
    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp started_at = 2;</code>
     */
    private $started_at = null;
    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp marked_at = 3;</code>
     */
    private $marked_at = null;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type int|string $score
     *     @type \Google\Protobuf\Timestamp $started_at
     *     @type \Google\Protobuf\Timestamp $marked_at
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Xsuportal\Resources\Leaderboard::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>int64 score = 1;</code>
     * @return int|string
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Generated from protobuf field <code>int64 score = 1;</code>
     * @param int|string $var
     * @return $this
     */
    public function setScore($var)
    {
        GPBUtil::checkInt64($var);
        $this->score = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp started_at = 2;</code>
     * @return \Google\Protobuf\Timestamp
     */
    public function getStartedAt()
    {
        return $this->started_at;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp started_at = 2;</code>
     * @param \Google\Protobuf\Timestamp $var
     * @return $this
     */
    public function setStartedAt($var)
    {
        GPBUtil::checkMessage($var, \Google\Protobuf\Timestamp::class);
        $this->started_at = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp marked_at = 3;</code>
     * @return \Google\Protobuf\Timestamp
     */
    public function getMarkedAt()
    {
        return $this->marked_at;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Timestamp marked_at = 3;</code>
     * @param \Google\Protobuf\Timestamp $var
     * @return $this
     */
    public function setMarkedAt($var)
    {
        GPBUtil::checkMessage($var, \Google\Protobuf\Timestamp::class);
        $this->marked_at = $var;

        return $this;
    }

}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(LeaderboardScore::class, \Xsuportal\Proto\Resources\Leaderboard_LeaderboardItem_LeaderboardScore::class);

