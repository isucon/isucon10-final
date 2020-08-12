package random

import (
	"testing"
)

func TestScoreBaseScore(t *testing.T) {
	s := &ScoreGenerator{
		InitialScore:         1000,
		Deviation:            300,
		FastFailRatio:        48,
		SlowFailRatio:        10,
		RiseCoefficient1:     99,
		RiseCoefficient2:     1.6,
		RisingIndex:          2,
		DeductionProbability: 50,
		DeductionRatio:       0.1,
		DeductionDeviation:   50,
	}

	for i := 0; i < 100; i++ {
		t.Logf("%d", s.Generate(int64(i)).Int())
	}
}
