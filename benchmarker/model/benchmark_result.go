package model

type BenchmarkResult struct {
	Score          int64
	ScoreRaw       int64
	ScoreDeduction int64
	Passed         bool
	ReasonHash     string
}
