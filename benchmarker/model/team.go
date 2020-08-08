package model

type Team struct {
	ID           int64
	TeamName     string
	EmailAddress string

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

	return &Team{
		Leader:    leader,
		Developer: developer,
		Operator:  operator,
	}, nil
}
