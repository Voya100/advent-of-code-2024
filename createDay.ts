#!/usr/bin/env -S deno run --allow-write --allow-read

async function main() {
  if (Deno.args.length === 0) {
    console.log('Usage: ./createDay.ts [dayNumber, 1-25]\nExample: ./createDay.ts 1');
    return;
  }

  const day = Number.parseInt(Deno.args[0]);

  if (isNaN(day)) {
    console.error(`Invalid day: ${Deno.args[0]}`);
    return;
  }

  if (day < 1 || day > 25) {
    console.error('Day must be between 1-25.');
    return;
  }

  await Promise.all([
    writeFile('src/templates/day_ts.template', `src/day${day}.ts`, day),
    writeFile('src/templates/day_test.template', `src/day${day}.test.ts`, day),
    await Deno.writeTextFile(`inputs/day${day}.txt`, ''),
  ]);
}

async function writeFile(templatePath: string, outputPath: string, day: number) {
  if (await fileExists(outputPath)) {
    console.error(`File ${day} already exists`);
    Deno.exit();
  }

  const template = await Deno.readTextFile(templatePath);
  await Deno.writeTextFile(outputPath, template.replaceAll('__DAY__', day.toString()));
}

async function fileExists(path: string) {
  try {
    await Deno.lstat(path);
    return true;
  } catch {
    return false;
  }
}

main();
