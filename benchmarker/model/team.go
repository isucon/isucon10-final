package model

import (
	"github.com/isucon/isucon10-final/benchmarker/random"
)

type Team struct {
	ID           int64
	TeamName     string
	EmailAddress string

	Hosts []*Host

	IsStudent bool
	Leader    *Contestant
	Developer *Contestant
	Operator  *Contestant
}

func NewTeam() (*Team, error) {
	// 1/6 の確率で学生チーム
	isStudent := random.Pecentage(1, 6)

	leader, err := NewContestant()
	if err != nil {
		return nil, err
	}
	developer, err := NewContestant()
	if err != nil {
		return nil, err
	}
	operator, err := NewContestant()
	if err != nil {
		return nil, err
	}

	if isStudent {
		// 学生チームなら全員を強制的に学生に
		leader.IsStudent = true
		developer.IsStudent = true
		operator.IsStudent = true
	} else {
		// 学生チームでないならリーダーを学生じゃなくすることで非学生を保証
		leader.IsStudent = false
	}

	hosts := []*Host{{}, {}, {}}

	return &Team{
		TeamName:     random.Alphabet(20),
		EmailAddress: random.Alphabet(16) + "@example.com",
		Hosts:        hosts,
		IsStudent:    isStudent,
		Leader:       leader,
		Developer:    developer,
		Operator:     operator,
	}, nil
}

func (t *Team) TargetHost() string {
	return t.Hosts[0].Name
}
