package model

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

type BenchmarkResult struct {
	id             int64
	Score          int64
	ScoreRaw       int64
	ScoreDeduction int64
	Passed         bool
	ReasonHash     string

	mu              sync.RWMutex
	sentFirstResult uint32
	sentLastResult  uint32
	seen            uint32
	markedAt        time.Time
}

func (b *BenchmarkResult) ID() int64 {
	return atomic.LoadInt64(&b.id)
}

func (b *BenchmarkResult) SetID(id int64) {
	atomic.StoreInt64(&b.id, id)
}

func (b *BenchmarkResult) IsSentFirstResult() bool {
	return atomic.LoadUint32(&b.sentFirstResult) != 0
}

func (b *BenchmarkResult) IsSentLastResult() bool {
	return atomic.LoadUint32(&b.sentLastResult) != 0
}

func (b *BenchmarkResult) IsSeen() bool {
	return atomic.LoadUint32(&b.seen) != 0
}

func (b *BenchmarkResult) SentFirstResult() {
	atomic.StoreUint32(&b.sentFirstResult, 1)
}

func (b *BenchmarkResult) SentLastResult() {
	atomic.StoreUint32(&b.sentLastResult, 1)
}

func (b *BenchmarkResult) Seen() {
	atomic.StoreUint32(&b.seen, 1)
}

func (b *BenchmarkResult) MarkedAt() time.Time {
	b.mu.RLock()
	defer b.mu.RUnlock()

	return b.markedAt
}

func (b *BenchmarkResult) Mark(t time.Time) {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.markedAt = t
}

func (b *BenchmarkResult) In(at time.Time) bool {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return b.IsSentLastResult() && (at.After(b.markedAt) || at.Equal(b.markedAt))
}

func (b *BenchmarkResult) String() string {
	return fmt.Sprintf("<Passed: %v / %d (%d - %d) sent(%v,%v) at %s>", b.Passed, b.Score, b.ScoreRaw, b.ScoreDeduction, b.IsSentFirstResult(), b.IsSentLastResult(), b.MarkedAt())
}

func (b *BenchmarkResult) GoString() string {
	return fmt.Sprintf("<Passed: %v / %d (%d - %d) sent(%v,%v) at %s>", b.Passed, b.Score, b.ScoreRaw, b.ScoreDeduction, b.IsSentFirstResult(), b.IsSentLastResult(), b.MarkedAt())
}
