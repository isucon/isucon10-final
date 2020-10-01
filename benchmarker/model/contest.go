package model

import (
	"sync"
	"time"
)

type Contest struct {
	mu                 sync.RWMutex
	RegistrationOpenAt time.Time
	ContestStartsAt    time.Time
	ContestFreezesAt   time.Time
	ContestEndsAt      time.Time
	GRPCHost           string
	GRPCPort           int64
	Teams              []*Team
	teamsByID          map[int64]*Team

	cmu            sync.RWMutex
	clarifications []*Clarification
}

func NewContest(now time.Time, testMode bool) *Contest {
	now = now.UTC().Truncate(time.Second).Add(1 * time.Second)

	c := &Contest{
		mu:                 sync.RWMutex{},
		RegistrationOpenAt: now,
		ContestStartsAt:    now.Add(10 * time.Second),
		ContestFreezesAt:   now.Add(50 * time.Second),
		ContestEndsAt:      now.Add(60 * time.Second),
		GRPCHost:           "",
		GRPCPort:           0,
		Teams:              []*Team{},
		teamsByID:          map[int64]*Team{},

		cmu:            sync.RWMutex{},
		clarifications: []*Clarification{},
	}

	if testMode {
		c.RegistrationOpenAt = now.Add(2 * time.Second)
		c.ContestStartsAt = now.Add(4 * time.Second)
		c.ContestFreezesAt = now.Add(6 * time.Second)
		c.ContestEndsAt = now.Add(8 * time.Second)
	}

	return c
}

func (c *Contest) AddTeam(team *Team) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.Teams = append(c.Teams, team)
	c.teamsByID[team.ID] = team
}

func (c *Contest) GetTeam(id int64) *Team {
	c.mu.RLock()
	defer c.mu.RUnlock()

	return c.teamsByID[id]
}

func (c *Contest) AddClar(clar *Clarification) {
	c.cmu.Lock()
	defer c.cmu.Unlock()

	c.clarifications = append(c.clarifications, clar)
}

func (c *Contest) Clarifications() []*Clarification {
	c.cmu.RLock()
	defer c.cmu.RUnlock()

	clars := make([]*Clarification, len(c.clarifications))
	copy(clars, c.clarifications[:])

	return clars
}
