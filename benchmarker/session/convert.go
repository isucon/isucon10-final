package session

import (
	"github.com/golang/protobuf/ptypes/timestamp"
	"time"
)

func time2Timestamp(t time.Time) *timestamp.Timestamp {
	return &timestamp.Timestamp{
		Seconds: t.Unix(),
		Nanos:   int32(t.Nanosecond()),
	}
}
