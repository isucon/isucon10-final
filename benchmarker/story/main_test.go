package story

import (
	"context"
	"github.com/rs/zerolog"
	"os"
	"testing"
)

func TestMain(t *testing.T) {
	story, err := NewStory("127.0.0.1:9292")
	if err != nil {
		t.Fatal(err)
	}

	story.stderrLogger.Level(zerolog.DebugLevel)
	story.stderrLogger.Output(os.Stderr)

	ctx := context.Background()

	err = story.Main(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// t.Log(story.stdout.String())
	t.Log(story.errors.GetMessages())
	t.Logf("%d", story.GetScore())
}
