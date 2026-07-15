import { broadcastAddress, detailsFor, ipToNumber, networkAddress, numberToIp, subnetMaskNumber } from "../lib/subnet/calculator";
import { generateQuestion } from "../lib/questions/generator";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (let iteration = 0; iteration < 10000; iteration += 1) {
  const prefix = Math.floor(Math.random() * 31) + 1;
  const ip = numberToIp(Math.floor(Math.random() * 0x100000000));
  const details = detailsFor(ip, prefix);
  const mask = subnetMaskNumber(prefix);
  const network = ipToNumber(details.network);
  const broadcast = ipToNumber(details.broadcast);
  assert(network === (ipToNumber(ip) & mask) >>> 0, `Invalid network for ${ip}/${prefix}`);
  assert(broadcast === ((network | (~mask >>> 0)) >>> 0), `Invalid broadcast for ${ip}/${prefix}`);
  assert(network <= ipToNumber(ip) && ipToNumber(ip) <= broadcast, `IP is outside its calculated range: ${ip}/${prefix}`);
  assert(networkAddress(ip, prefix) === details.network, "Network calculation is not deterministic");
  assert(broadcastAddress(ip, prefix) === details.broadcast, "Broadcast calculation is not deterministic");
}

for (let iteration = 0; iteration < 10000; iteration += 1) {
  const question = generateQuestion();
  assert(question.prompt.length > 0 && question.answer.length > 0 && question.explanation.length > 0, "Generator emitted an incomplete question");
}

console.info("Validated 10,000 subnet calculations and 10,000 generated questions.");
