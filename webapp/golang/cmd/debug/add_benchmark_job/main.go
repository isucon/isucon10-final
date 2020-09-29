package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"sort"

	xsuportal "github.com/isucon/isucon10-final/webapp/golang"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("add_benchmark_job: ")
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage of %s:\n", os.Args[0])
		flag.PrintDefaults()
		fmt.Fprintln(flag.CommandLine.Output(), "Available Statuses:")
		var keys []int
		for key := range resources.BenchmarkJob_Status_name {
			keys = append(keys, int(key))
		}
		sort.Ints(keys)
		for _, key := range keys {
			fmt.Fprintf(flag.CommandLine.Output(), "  %v: %v\n", key, resources.BenchmarkJob_Status_name[int32(key)])
		}
	}

	var flags struct {
		TeamID     int
		TargetHost string
		Status     int
	}
	flag.IntVar(&flags.TeamID, "t", 0, "team id (required)")
	flag.StringVar(&flags.TargetHost, "h", "xsu-001", "benchmark target host")
	flag.IntVar(&flags.Status, "s", 0, "status")
	flag.Parse()

	if flags.TeamID == 0 {
		flag.Usage()
		log.Print("-t is required")
		os.Exit(2)
	}

	statusName, ok := resources.BenchmarkJob_Status_name[int32(flags.Status)]
	if !ok {
		flag.Usage()
		log.Printf("invalid status: %d", flags.Status)
		os.Exit(2)
	}

	db, err := xsuportal.GetDB()
	if err != nil {
		return fmt.Errorf("get db: %w", err)
	}
	defer db.Close()

	res, err := db.Exec(
		"INSERT INTO `benchmark_jobs` (`team_id`, `status`, `target_hostname`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))",
		flags.TeamID,
		flags.Status,
		flags.TargetHost,
	)
	if err != nil {
		return fmt.Errorf("insert benchmark job: %w", err)
	}
	id, _ := res.LastInsertId()
	fmt.Printf("Inserted job id=%v, hostname=%v, status=%v (%v)\n", id, flags.TargetHost, flags.Status, statusName)
	return nil
}
