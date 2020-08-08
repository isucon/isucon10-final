package model

import (
	"time"
)

type Contest struct {
	RegistrationOpenAt time.Time
	ContestStartsAt    time.Time
	ContestFreezesAt   time.Time
	ContestEndsAt      time.Time
	Teams              []*Team
}
