import murmurhash from "murmurhash";

export interface BloomFilter {
    add(s: string): void
    check(s: string): boolean
}

export class BloomFilter implements BloomFilter {

    private bits; 
    private hashes; 
    private size

    constructor(size = 1024, hashCount = 8){
        if (size < 1) throw "You must have at least 1 item in the filter"
        if (hashCount < 1) throw "You must have at least 1 hash"

        this.bits   = new Array(size).fill(0)
        this.hashes = new Array(hashCount)
                        .fill(Number.MAX_SAFE_INTEGER)
                        .map(max => Math.floor(Math.random() * max))
                        .map(seed => (s: any) => murmurhash.v3(s, seed))
        this.size = size
        
    }

    add(s: string){
        this.computeHashes(s)
            .forEach(n => this.bits[n] = 1)
    }

    check(s: string){
        return this.computeHashes(s)
            .every(n => this.bits[n])
    }

    private computeHashes(s: string){
        return this.hashes
            .map(fn => fn(s))
            .map(n => n % this.size)
    }
}

// const bf = new BloomFilter()

// bf.add("more")
// bf.add("mo")
// bf.add("mor")

// console.log(bf.check("mor"))