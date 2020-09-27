package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/golang/protobuf/proto"

	xsuportal "github.com/isucon/isucon10-final/webapp/golang"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("show_notifications: ")
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	var flags struct {
		ContestantID string
	}
	flag.StringVar(&flags.ContestantID, "c", "", "contestant id (required)")
	flag.Parse()

	if flags.ContestantID == "" {
		flag.Usage()
		log.Print("-c is required")
		os.Exit(2)
	}

	db, err := xsuportal.GetDB()
	if err != nil {
		return fmt.Errorf("get db: %w", err)
	}

	var notifications []*xsuportal.Notification
	err = db.Select(
		&notifications,
		"SELECT * FROM `notifications` WHERE `contestant_id` = ? ORDER BY `id`",
		flags.ContestantID,
	)
	if err != sql.ErrNoRows && err != nil {
		return fmt.Errorf("select notifications: %w", err)
	}

	ns := []interface{}{}
	for _, notification := range notifications {
		b, err := base64.StdEncoding.DecodeString(notification.EncodedMessage)
		if err != nil {
			return fmt.Errorf("decode base64: %w", err)
		}
		var n resources.Notification
		if err := proto.Unmarshal(b, &n); err != nil {
			return fmt.Errorf("unmarshal notification: %w", err)
		}
		ns = append(ns, map[string]interface{}{
			"notification": notification,
			"message":      &n,
		})
	}
	return json.NewEncoder(os.Stdout).Encode(ns)
}
