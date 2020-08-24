package session

import (
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/timestamp"
	"time"
)

func time2Timestamp(t time.Time) *timestamp.Timestamp {
	pt, _ := ptypes.TimestampProto(t)
	return pt
}
