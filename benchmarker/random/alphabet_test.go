package random

import (
	"testing"
)

func TestAlphabet(t *testing.T) {
	a := Alphabet(10)
	if len(a) != 10 {
		t.Fatal(a)
	}
}
