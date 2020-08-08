package model

type Team struct {
	ID           int64
	TeamName     string
	EmailAddress string

	Hosts []*Host

	Leader    *Contestant
	Developer *Contestant
	Operator  *Contestant
}

func NewTeam() (*Team, error) {
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

	hosts := []*Host{{}, {}, {}}

	return &Team{
		Hosts:     hosts,
		Leader:    leader,
		Developer: developer,
		Operator:  operator,
	}, nil
}

func (t *Team) TargetHost() string {
	return t.Hosts[0].Name
}
