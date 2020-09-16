package random

import (
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

func Question() string {
	return singleQuestionPrefix[rand.Intn(len(singleQuestionPrefix))] + singleQuestionSuffix[rand.Intn(len(singleQuestionSuffix))]
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
