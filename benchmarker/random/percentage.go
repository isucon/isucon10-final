package random

import (
	"math/rand"
)

func Pecentage(decimal int, parameter int) bool {
	return rand.Intn(parameter) < decimal
}
