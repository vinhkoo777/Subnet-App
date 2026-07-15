const UINT32_MAX = 0xffffffff;

export function ipToNumber(ip) {
  const parts = String(ip).trim().split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part) || Number(part) > 255)) {
    throw new Error("Invalid IPv4 address");
  }
  return parts.reduce((value, part) => ((value << 8) >>> 0) + Number(part), 0) >>> 0;
}

export function numberToIp(value) {
  const number = Number(value) >>> 0;
  return [24, 16, 8, 0].map((shift) => (number >>> shift) & 255).join(".");
}

export function getSubnetMaskNumber(prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("Invalid prefix");
  return prefix === 0 ? 0 : (UINT32_MAX << (32 - prefix)) >>> 0;
}

export function getSubnetMask(prefix) {
  return numberToIp(getSubnetMaskNumber(prefix));
}

export function getWildcardMask(prefix) {
  return numberToIp((~getSubnetMaskNumber(prefix)) >>> 0);
}

export function getNetworkNumber(ip, prefix) {
  return (ipToNumber(ip) & getSubnetMaskNumber(prefix)) >>> 0;
}

export function getNetworkAddress(ip, prefix) {
  return numberToIp(getNetworkNumber(ip, prefix));
}

export function getBroadcastAddress(ip, prefix) {
  const network = getNetworkNumber(ip, prefix);
  return numberToIp((network | (~getSubnetMaskNumber(prefix) >>> 0)) >>> 0);
}

export function getFirstHost(ip, prefix) {
  const network = getNetworkNumber(ip, prefix);
  return numberToIp(prefix >= 31 ? network : network + 1);
}

export function getLastHost(ip, prefix) {
  const broadcast = ipToNumber(getBroadcastAddress(ip, prefix));
  return numberToIp(prefix >= 31 ? broadcast : broadcast - 1);
}

export function getUsableHosts(prefix) {
  if (prefix === 32) return 1;
  if (prefix === 31) return 2;
  return 2 ** (32 - prefix) - 2;
}

export function getBlockSize(prefix) {
  const remainder = prefix % 8;
  return remainder === 0 ? 256 : 2 ** (8 - remainder);
}

export function determineSameSubnet(leftIp, rightIp, prefix) {
  return getNetworkNumber(leftIp, prefix) === getNetworkNumber(rightIp, prefix);
}

export function binaryIp(ip) {
  return String(ip).split(".").map((part) => Number(part).toString(2).padStart(8, "0")).join(".");
}

export function getPrefixFromMask(mask) {
  const binary = binaryIp(mask).replaceAll(".", "");
  if (!/^1*0*$/.test(binary)) throw new Error("Mask must be contiguous");
  return binary.indexOf("0") === -1 ? 32 : binary.indexOf("0");
}

export function subnetDetails(ip, prefix) {
  const network = getNetworkAddress(ip, prefix);
  const broadcast = getBroadcastAddress(ip, prefix);
  return {
    ip,
    prefix,
    mask: getSubnetMask(prefix),
    wildcard: getWildcardMask(prefix),
    blockSize: getBlockSize(prefix),
    network,
    broadcast,
    firstHost: getFirstHost(ip, prefix),
    lastHost: getLastHost(ip, prefix),
    usableHosts: getUsableHosts(prefix),
  };
}

export function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, "");
}

export function formatAnswer(value) {
  return String(value);
}

export function calculatePoints(difficulty, elapsed = 999) {
  const base = difficulty === "Hard" ? 20 : difficulty === "Medium" ? 15 : 10;
  return base + (elapsed <= 20 ? 5 : 0);
}

export function getLevelFromXp(xp) {
  return Math.floor((Math.sqrt(1 + (8 * Math.max(0, xp)) / 75) - 1) / 2) + 1;
}

export function getLevelProgress(xp) {
  const level = getLevelFromXp(xp);
  const before = 75 * ((level - 1) * level) / 2;
  const next = 75 * (level * (level + 1)) / 2;
  return { level, current: xp - before, required: next - before, progress: ((xp - before) / (next - before)) * 100 };
}

export function getQuestionTypeLabel(type) {
  return ({ network: "Network address", broadcast: "Broadcast address", firstHost: "First usable host", lastHost: "Last usable host", hosts: "Usable hosts", mask: "Subnet mask", wildcard: "Wildcard mask", cidr: "CIDR prefix", block: "Block size", binary: "Binary conversion", sameSubnet: "Same subnet", nextSubnet: "Next subnet" })[type] || "IPv4 analysis";
}

function choice(items) { return items[Math.floor(Math.random() * items.length)]; }
function randomIp(prefix) {
  const privateStarts = ["10", "172", "192"];
  const first = choice(privateStarts);
  const second = first === "172" ? 16 + Math.floor(Math.random() * 16) : Math.floor(Math.random() * 256);
  const third = Math.floor(Math.random() * 256);
  const fourth = Math.floor(Math.random() * 256);
  return `${first}.${second}.${third}.${fourth}`;
}

function explanation(details) {
  const boundaryOctet = Math.ceil(details.prefix / 8) || 1;
  return `<div class="explanation-grid"><div><span>Subnet mask</span><strong>${details.mask}</strong></div><div><span>Prefix</span><strong>/${details.prefix}</strong></div><div><span>Block size</span><strong>${details.blockSize}</strong></div><div><span>Usable hosts</span><strong>${details.usableHosts.toLocaleString()}</strong></div></div><p>The /${details.prefix} mask creates blocks of <strong>${details.blockSize}</strong> in octet ${boundaryOctet}. Zeroing host bits gives <strong>${details.network}</strong>; setting host bits to 1 gives <strong>${details.broadcast}</strong>.</p><div class="answer-grid"><span>Network <b>${details.network}</b></span><span>First host <b>${details.firstHost}</b></span><span>Last host <b>${details.lastHost}</b></span><span>Broadcast <b>${details.broadcast}</b></span></div>`;
}

export function generateSubnetQuestion(options = {}) {
  const difficulty = options.difficulty && options.difficulty !== "Adaptive" ? options.difficulty : choice(["Easy", "Easy", "Medium", "Medium", "Hard"]);
  const prefix = choice(difficulty === "Easy" ? [24, 25, 26] : difficulty === "Medium" ? [27, 28, 29] : [22, 23, 24, 25, 26, 27, 28, 29, 30]);
  const ip = randomIp(prefix);
  const details = subnetDetails(ip, prefix);
  const type = choice(["network", "broadcast", "firstHost", "lastHost", "hosts", "mask", "wildcard", "cidr", "block", "binary", "sameSubnet", "nextSubnet"]);
  const context = `<span class="network-token">${ip}/${prefix}</span>`;
  const base = { id: `${Date.now()}-${Math.random()}`, type, difficulty, ip, prefix, details, explanation: explanation(details) };
  const questions = {
    network: { prompt: "Find the network address", body: `Given ${context}, identify the first address in the subnet.`, answer: details.network },
    broadcast: { prompt: "Find the broadcast address", body: `Given ${context}, identify the final address in the subnet.`, answer: details.broadcast },
    firstHost: { prompt: "Find the first usable host", body: `Given ${context}, what is the first usable IPv4 host?`, answer: details.firstHost },
    lastHost: { prompt: "Find the last usable host", body: `Given ${context}, what is the final usable IPv4 host?`, answer: details.lastHost },
    hosts: { prompt: "Calculate usable hosts", body: `How many usable host addresses does ${context} provide?`, answer: String(details.usableHosts) },
    mask: { prompt: "Convert CIDR to subnet mask", body: `Write the dotted-decimal mask for <span class="network-token">/${prefix}</span>.`, answer: details.mask },
    wildcard: { prompt: "Find the wildcard mask", body: `What wildcard mask matches ${context}?`, answer: details.wildcard },
    cidr: { prompt: "Convert mask to CIDR", body: `Write the CIDR prefix for <span class="network-token">${details.mask}</span>.`, answer: `/${prefix}` },
    block: { prompt: "Calculate the block size", body: `For ${context}, what is the block size in the interesting octet?`, answer: String(details.blockSize) },
    binary: { prompt: "Convert the mask to binary", body: `Write <span class="network-token">${details.mask}</span> in binary (with dots).`, answer: binaryIp(details.mask) },
    sameSubnet: (() => { const peer = numberToIp((ipToNumber(details.network) + Math.min(5, Math.max(1, details.usableHosts))) >>> 0); return { prompt: "Check network membership", body: `Are <span class="network-token">${ip}</span> and <span class="network-token">${peer}</span> in the same /${prefix} subnet? Answer yes or no.`, answer: "yes" }; })(),
    nextSubnet: { prompt: "Find the next subnet", body: `What is the network address immediately after <span class="network-token">${details.network}/${prefix}</span>?`, answer: numberToIp((ipToNumber(details.network) + 2 ** (32 - prefix)) >>> 0) },
  };
  return { ...base, ...questions[type] };
}
