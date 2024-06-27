package utils


// This is a generic map function kinda like the js map function
// Example use
// input := []int{2, 4, 8}
// doubledInput := Map(input, func(v int) int { return v * 2 })
// doubledInput: {4, 8, 14}

func Map[T, V any](ts []T, fn func(T) V) []V {
    result := make([]V, len(ts))
    for i, t := range ts {
        result[i] = fn(t)
    }
    return result
}
