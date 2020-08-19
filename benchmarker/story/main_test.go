package story

import (
	"context"
	"testing"
)

func TestMain(t *testing.T) {
	story, err := NewStory("127.0.0.1:9292")
	if err != nil {
		t.Fatal(err)
	}

	ctx := context.Background()

	err = story.Main(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// t.Log(story.stdout.String())
	t.Log(story.errors.GetMessages())
	t.Logf("%d", story.GetScore())
}
