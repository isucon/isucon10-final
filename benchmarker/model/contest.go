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

func NewContest() *Contest {
	return &Contest{
		RegistrationOpenAt: time.Now(),
		ContestStartsAt:    time.Now(),
		ContestFreezesAt:   time.Now(),
		ContestEndsAt:      time.Now(),
		Teams:              []*Team{},
	}
}
