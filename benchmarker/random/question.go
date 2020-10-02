package random

import (
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"math/rand"
)

var (
	singleQuestionPrefix = []string{
		"SSH が",
		"ブラウザで",
		"アプリケーションが",
		"サーバーが",
		"システムが",
	}
	singleQuestionSuffix = []string{
		"接続できません",
		"うまく動きません",
		"壊れています",
		"どう動いているかわかりません",
	}
)

var (
	salt = []byte{}
)

func init() {
	saltBytes := make([]byte, 128)
	_, err := rand.Read(saltBytes)
	if err != nil {
		panic(err)
	}
	salt = saltBytes[:]
}

func Question(id int64) string {
	h := sha256.New()
	if err := binary.Write(h, binary.LittleEndian, id); err != nil {
		panic(err)
	}
	if _, err := h.Write(salt); err != nil {
		panic(err)
	}
	body := singleQuestionPrefix[rand.Intn(len(singleQuestionPrefix))] + singleQuestionSuffix[rand.Intn(len(singleQuestionSuffix))]
	return fmt.Sprintf("%s\n%x", body, h.Sum(nil))
}

var (
	singleAnswerPrefix = []string{
		"返答",
		"解答",
		"問題の再現",
		"運営内での協議",
	}
	singleAnswerSuffix = []string{
		"しました",
		"できかねます",
		"は後ほど個別にお送りします",
	}
)

func Answer() string {
	return singleAnswerPrefix[rand.Intn(len(singleAnswerPrefix))] + singleAnswerSuffix[rand.Intn(len(singleAnswerSuffix))]
}
