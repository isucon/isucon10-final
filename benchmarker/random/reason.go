package random

import (
	"math/rand"
	"strings"
)

var (
	successReasons = []string{
		"load: verification: 検証に成功しました",
		"load: http: ステータスコードの検証成功",
		"load: html: HTML 構造の検証に成功しました",
		"load: checksum: MD5 チェックサムの一致",
	}
	errorReasons = []string{
		"load: verification: 検証に失敗しました",
		"load: timeout: タイムアウトしました",
		"load: cancel: キャンセルされました",
		"load: error: エラーを検知しました",
		"load: http: ステータスコードの検証失敗",
		"load: html: HTML 構造の検証に失敗しました",
		"load: checksum: MD5 チェックサムの不一致",
	}
	reasons []string = []string{}
)

func init() {
	reasons = append(reasons, successReasons...)
	reasons = append(reasons, errorReasons...)
}

const (
	MAX_REASON_SIZE = 200
)

func Reason(passed bool) string {
	r := reasons
	if passed {
		r = successReasons
	}

	c := 0
	lines := []string{}
	for {
		text := r[rand.Intn(len(r))]
		if c+len(text)+1 < MAX_REASON_SIZE {
			lines = append(lines, text)
			c += len(text) + 1
		} else {
			break
		}
	}
	return strings.Join(lines, "\n")
}
