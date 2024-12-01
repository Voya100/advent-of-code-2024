This is repository for my solutions for Advent of Code 2024 programming puzzles (https://adventofcode.com/2024/about).

Puzzle solutions are implemented with TypeScript/Deno (v2). Scripts can be run with `./main.ts X`, where X is in range
[1,25]. If using Windows PowerShell, need to use `deno main.ts X` or `deno run --allow-read main.ts X`.

All solutions can be run at once with `./main.ts all`. For more specific performance analysis `--performance` flag can
be added, which runs solutions multiple times and shows duration average.

Run tests with `deno test` or `deno test --watch`. Specific day can be tested with `deno test --filter "day X"`. Linting
can be run with `deno lint`.

Templates for day's scripts and test can be generated with `./createDay.ts X`.
