package random

import (
	"math"
	"math/rand"
)

type ScoreGenerator struct {
	// 初期スコア
	InitialScore int64
	// 振れ幅
	Deviation int64
	// Fast Fail 確率(1/100)
	FastFailRatio int64
	// Slow Fail 確率(1/100)
	SlowFailRatio int64
	// スコア上昇係数1
	RiseCoefficient1 float64
	// スコア上昇係数2
	RiseCoefficient2 float64
	// スコア上昇指数
	RisingIndex float64
	// 遅咲き定数
	LateBloomConst int64
	// 減点確率(1/100)
	DeductionProbability int64
	// 減点率
	DeductionRatio float64
	// 減点振れ幅
	DeductionDeviation int64
}

type Score struct {
	Base      int64
	Deduction int64
	FastFail  bool
	SlowFail  bool
}

func (s *ScoreGenerator) BaseScore(index int64) int64 {
	deviation := index
	if index > s.LateBloomConst {
		// INT($N$7*POWER((A2-$N$9)+$N$6,$N$8))
		deviation = int64(math.Floor(s.RiseCoefficient2 * math.Pow((float64(index-s.LateBloomConst))+s.RiseCoefficient1, s.RisingIndex)))
	}
	return (s.InitialScore + deviation + (s.Deviation/2 + rand.Int63n(s.Deviation/2)))
}

func (s *ScoreGenerator) Deduction(index int64, base int64) int64 {
	if rand.Int63n(100) < s.DeductionProbability {
		return (rand.Int63n(s.DeductionDeviation/2) + s.DeductionDeviation/2) + int64(math.Floor(float64(base)*s.DeductionRatio))
	} else {
		return 0
	}
}

func (s *ScoreGenerator) Generate(index int64) *Score {
	base := s.BaseScore(index)
	deduction := s.Deduction(index, base)

	fastFail := rand.Int63n(100) < s.FastFailRatio
	slowFail := rand.Int63n(100) < s.SlowFailRatio

	return &Score{
		Base:      base - deduction,
		Deduction: deduction,
		FastFail:  fastFail,
		SlowFail:  slowFail || fastFail,
	}
}

func (s *Score) Int() int64 {
	if s.FastFail || s.SlowFail {
		return 0
	} else {
		return s.Base - s.Deduction
	}
}
