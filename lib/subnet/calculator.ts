import type { SubnetDetails } from "@/types/subnet";

const UINT32_MAX = 0xffffffff;

export function ipToNumber(ip: string): number {
  const octets = ip.split(".");
  if (octets.length !== 4 || octets.some((octet) => !/^\d+$/.test(octet) || Number(octet) > 255)) {
    throw new Error("An IPv4 address must have four octets between 0 and 255.");
  }
  return octets.reduce((value, octet) => ((value << 8) >>> 0) + Number(octet), 0) >>> 0;
}

export function numberToIp(value: number): string {
  const normalized = value >>> 0;
  return [24, 16, 8, 0].map((shift) => (normalized >>> shift) & 255).join(".");
}

export function subnetMaskNumber(prefix: number): number {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("Prefix must be between /0 and /32.");
  return prefix === 0 ? 0 : (UINT32_MAX << (32 - prefix)) >>> 0;
}

export function subnetMask(prefix: number): string { return numberToIp(subnetMaskNumber(prefix)); }
export function wildcardMask(prefix: number): string { return numberToIp((~subnetMaskNumber(prefix)) >>> 0); }
export function networkNumber(ip: string, prefix: number): number { return (ipToNumber(ip) & subnetMaskNumber(prefix)) >>> 0; }
export function networkAddress(ip: string, prefix: number): string { return numberToIp(networkNumber(ip, prefix)); }
export function broadcastAddress(ip: string, prefix: number): string { return numberToIp((networkNumber(ip, prefix) | (~subnetMaskNumber(prefix) >>> 0)) >>> 0); }
export function usableHosts(prefix: number): number { return prefix === 32 ? 1 : prefix === 31 ? 2 : 2 ** (32 - prefix) - 2; }
export function blockSize(prefix: number): number { return prefix % 8 === 0 ? 256 : 2 ** (8 - (prefix % 8)); }
export function isPrivate(ip: string): boolean { const [a, b] = ip.split(".").map(Number); return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168); }
export function sameSubnet(left: string, right: string, prefix: number): boolean { return networkNumber(left, prefix) === networkNumber(right, prefix); }
export function hostId(ip: string, prefix: number): string { return numberToIp((ipToNumber(ip) & (~subnetMaskNumber(prefix) >>> 0)) >>> 0); }
export function binaryIp(ip: string): string { return ip.split(".").map((octet) => Number(octet).toString(2).padStart(8, "0")).join("."); }
export function classfulClass(ip: string): "A" | "B" | "C" | "D" | "E" {
  const first = Number(ip.split(".")[0]);
  if (first <= 127) return "A";
  if (first <= 191) return "B";
  if (first <= 223) return "C";
  if (first <= 239) return "D";
  return "E";
}
export function smallestPrefixForHosts(hosts: number): number {
  if (!Number.isInteger(hosts) || hosts < 1 || hosts > 0x7ffffffe) throw new Error("Host count must be a positive IPv4 value.");
  if (hosts === 1) return 32;
  if (hosts === 2) return 31;
  return 32 - Math.ceil(Math.log2(hosts + 2));
}

export function detailsFor(ip: string, prefix: number): SubnetDetails {
  const network = networkAddress(ip, prefix); const broadcast = broadcastAddress(ip, prefix);
  const networkValue = ipToNumber(network); const broadcastValue = ipToNumber(broadcast);
  return { ip, prefix, mask: subnetMask(prefix), wildcard: wildcardMask(prefix), network, broadcast, firstHost: numberToIp(prefix >= 31 ? networkValue : networkValue + 1), lastHost: numberToIp(prefix >= 31 ? broadcastValue : broadcastValue - 1), usableHosts: usableHosts(prefix), totalAddresses: 2 ** (32 - prefix), blockSize: blockSize(prefix) };
}
