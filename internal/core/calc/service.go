package calc

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) EvalBasic(op string, a, b float64) (float64, error) {
	switch op {
	case "add":
		return a + b, nil
	case "sub":
		return a - b, nil
	case "mul":
		return a * b, nil
	case "div":
		if b == 0 {
			return 0, fmt.Errorf("division by zero")
		}
		return a / b, nil
	case "pow":
		return math.Pow(a, b), nil
	default:
		return 0, fmt.Errorf("unsupported op")
	}
}

func (s *Service) ConvertUnit(category string, value float64, from, to string) (float64, error) {
	if from == to {
		return value, nil
	}
	switch category {
	case "length":
		meters, ok := map[string]float64{"m": 1, "km": 1000, "cm": 0.01, "mm": 0.001}[from]
		if !ok {
			return 0, fmt.Errorf("unknown from unit")
		}
		toMeters, ok := map[string]float64{"m": 1, "km": 1000, "cm": 0.01, "mm": 0.001}[to]
		if !ok {
			return 0, fmt.Errorf("unknown to unit")
		}
		return value * meters / toMeters, nil
	case "weight":
		grams, ok := map[string]float64{"g": 1, "kg": 1000, "mg": 0.001, "lb": 453.59237}[from]
		if !ok {
			return 0, fmt.Errorf("unknown from unit")
		}
		toGrams, ok := map[string]float64{"g": 1, "kg": 1000, "mg": 0.001, "lb": 453.59237}[to]
		if !ok {
			return 0, fmt.Errorf("unknown to unit")
		}
		return value * grams / toGrams, nil
	case "temperature":
		return convertTemp(value, from, to)
	default:
		return 0, fmt.Errorf("unsupported category")
	}
}

func convertTemp(v float64, from, to string) (float64, error) {
	toC := 0.0
	switch from {
	case "c":
		toC = v
	case "f":
		toC = (v - 32) * 5 / 9
	case "k":
		toC = v - 273.15
	default:
		return 0, fmt.Errorf("unknown from unit")
	}
	switch to {
	case "c":
		return toC, nil
	case "f":
		return toC*9/5 + 32, nil
	case "k":
		return toC + 273.15, nil
	default:
		return 0, fmt.Errorf("unknown to unit")
	}
}

func (s *Service) Percentage(mode string, x, y float64) (float64, error) {
	switch mode {
	case "x_percent_of_y":
		return (x / 100) * y, nil
	case "x_is_what_percent_of_y":
		if y == 0 {
			return 0, fmt.Errorf("division by zero")
		}
		return (x / y) * 100, nil
	case "percent_change":
		if x == 0 {
			return 0, fmt.Errorf("division by zero")
		}
		return ((y - x) / x) * 100, nil
	default:
		return 0, fmt.Errorf("unsupported mode")
	}
}

func (s *Service) DateDiff(startISO, endISO string) (int, error) {
	start, err := time.Parse("2006-01-02", startISO)
	if err != nil {
		return 0, err
	}
	end, err := time.Parse("2006-01-02", endISO)
	if err != nil {
		return 0, err
	}
	return int(end.Sub(start).Hours() / 24), nil
}

func (s *Service) AddDays(dateISO string, days int) (string, error) {
	d, err := time.Parse("2006-01-02", dateISO)
	if err != nil {
		return "", err
	}
	return d.AddDate(0, 0, days).Format("2006-01-02"), nil
}

func (s *Service) TimestampToISO(ts int64) string {
	return time.Unix(ts, 0).UTC().Format(time.RFC3339)
}

func (s *Service) ISOToTimestamp(iso string) (int64, error) {
	t, err := time.Parse(time.RFC3339, iso)
	if err != nil {
		return 0, err
	}
	return t.Unix(), nil
}

func (s *Service) NumberBase(input string, fromBase, toBase int) (string, error) {
	v, err := strconv.ParseInt(strings.TrimSpace(input), fromBase, 64)
	if err != nil {
		return "", err
	}
	return strconv.FormatInt(v, toBase), nil
}
