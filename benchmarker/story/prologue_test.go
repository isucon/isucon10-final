package story

import (
	"context"
	"testing"
)

func TestPrologue(t *testing.T) {
	story, err := NewStory("localhost:9292")
	if err != nil {
		t.Fatal(err)
	}

	ctx := context.Background()

	err = story.Prologue(ctx)
	if err != nil {
		t.Fatal(err)
	}
}
