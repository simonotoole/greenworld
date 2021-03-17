/**
 * A class representing an Agent's genotype.
 * */
class Genotype {
    /**
     * Create a genotype.
     * @public
     * @param {number} totalGenes The total number of genes encoded in the chromosome.
     * @param {number[]} chromosome An array of floating-point numbers encoding a genetic representation.
     */
    constructor(totalGenes, chromosome = []) {
        /** @private {number[]} */
        this.totalGenes_ = totalGenes;
        this.chromosome_ = chromosome;

        for (let i = 0; i < this.totalGenes_; i++) {
            this.chromosome_[i] = 0;
        }
    }

    /**
     * Get this Genotype's chromosome.
     * @public
     * @returns {number[]} An array of floating-point numbers encoding a genetic representation.
     */
    getChromosome() {
        return this.chromosome_;
    }

    /**
     * Get the gene at the specified index in the chromosome.
     * @public
     * @param {number} index The index at which the desired gene should be found.
     * @returns {number} A floating-point number representing the gene's value.
     */
    getGene(index) {
        return this.chromosome_[index];
    }

    /**
     * Weight the desired gene with the given value.
     * @public
     * @param {number} index The index of the desired gene.
     * @param {number} weight The value to weight the gene by.
     */
    setGene(index, weight) {
        this.chromosome_[index] = weight;
    }

    /**
     * Produce a new Genotype by performing crossover between this Genotype and
     * a partner Genotype.
     * @param {Genotype} partner The partner Genotype.
     * @returns {Genotype} The resulting Genotype.
     */
    crossover(partner) {
        let childChromosome = [];
        const midpoint = Math.floor(Math.random() * this.chromosome_.length);

        // Perform single-point crossover.
        for (let i = 0; i < this.chromosome_.length; i++) {
            if (i > midpoint) {
                childChromosome[i] = this.getGene(i);
            } else {
                childChromosome[i] = partner.getGene(i);
            }
        }

        return new Genotype(this.totalGenes_, childChromosome);
    }

    /**
     * Randomly mutate this Genotype.
     * @param {number} mutationRate The probability of performing mutation on any particular gene.
     */
    mutate(mutationRate) {
        for (let i = 0; i < this.chromosome_.length; i++) {
            if (Math.random() < mutationRate) {
                this.chromosome_[i] = randomGaussian(0, 0.25);
            }
        }
    }
}
