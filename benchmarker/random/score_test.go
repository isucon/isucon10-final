package random

import (
	"testing"
)

func TestScoreBaseScore(t *testing.T) {
	s := NewScoreGenerator()

	for i := 0; i < 100; i++ {
		t.Logf("%d", s.Generate(int64(i)).Int())
	}
}
