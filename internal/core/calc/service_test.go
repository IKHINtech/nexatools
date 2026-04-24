package calc

import (
	"math"
	"testing"
)

func TestCalcBasicAndUnits(t *testing.T) {
	svc := NewService()

	if got, _ := svc.EvalBasic("pow", 2, 3); got != 8 {
		t.Fatalf("EvalBasic() = %v", got)
	}
	if got, _ := svc.ConvertUnit("length", 1500, "m", "km"); got != 1.5 {
		t.Fatalf("ConvertUnit(length) = %v", got)
	}
	if got, _ := svc.ConvertUnit("temperature", 100, "c", "f"); math.Abs(got-212) > 0.0001 {
		t.Fatalf("ConvertUnit(temperature) = %v", got)
	}
}

func TestCalcPercentageDateAndBase(t *testing.T) {
	svc := NewService()

	if got, _ := svc.Percentage("x_is_what_percent_of_y", 25, 200); got != 12.5 {
		t.Fatalf("Percentage() = %v", got)
	}
	if got, _ := svc.DateDiff("2026-01-01", "2026-01-11"); got != 10 {
		t.Fatalf("DateDiff() = %d", got)
	}
	if got, _ := svc.AddDays("2026-01-01", 40); got != "2026-02-10" {
		t.Fatalf("AddDays() = %q", got)
	}
	if got := svc.TimestampToISO(0); got != "1970-01-01T00:00:00Z" {
		t.Fatalf("TimestampToISO() = %q", got)
	}
	if got, _ := svc.ISOToTimestamp("1970-01-01T00:00:10Z"); got != 10 {
		t.Fatalf("ISOToTimestamp() = %d", got)
	}
	if got, _ := svc.NumberBase("ff", 16, 2); got != "11111111" {
		t.Fatalf("NumberBase() = %q", got)
	}
}
