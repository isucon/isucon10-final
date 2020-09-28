package scenario

import (
	"os"

	"log"
)

var (
	ContestantLogger *log.Logger
	AdminLogger      *log.Logger
)

func init() {
	ContestantLogger = log.New(os.Stdout, "", log.Lmicroseconds)
	AdminLogger = log.New(os.Stderr, "", log.Lmicroseconds)
}
