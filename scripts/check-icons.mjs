// Fails when a page or meta.json names an icon that lucide-react does not export.
//
// fumadocs' lucideIconsPlugin looks icons up in `icons` from lucide-react and
// renders whatever it finds. An unknown name (or a lucide alias such as
// "CircleHelp", which is not part of `icons`) becomes `undefined`, and React
// then throws "Element type is invalid" for every page in that sidebar root,
// with no warning at build time. This check runs before lint and build.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { icons } from "lucide-react";

const root = new URL("../content", import.meta.url).pathname;
const problems = [];

function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) walk(path);
		else if (entry.name === "meta.json") checkMeta(path);
		else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) checkPage(path);
	}
}

function check(path, icon) {
	if (icon && !(icon in icons)) problems.push(`${relative(process.cwd(), path)}: unknown icon "${icon}"`);
}

function checkMeta(path) {
	check(path, JSON.parse(readFileSync(path, "utf8")).icon);
}

function checkPage(path) {
	const frontmatter = readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---/);
	const icon = frontmatter?.[1].match(/^icon:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];
	check(path, icon);
}

walk(root);

if (problems.length > 0) {
	console.error("Unknown lucide icons (see https://lucide.dev/icons for valid names):");
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
console.log("Icons ok");
