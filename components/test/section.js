export class Section {
    constructor(string, popen, pclose) {
        this.string_original = string;
        this.string = string;
        this.popen = popen;
        this.pclose = pclose;
        this.placeholders = [];
        this.words = [];
        this.last_sp = 0;
        this.last_words = "";
        this.parts = [];
    }

    getFromBetween() {
        if (this.string.indexOf(this.popen) < 0 || this.string.indexOf(this.pclose) < 0) return false;
        let SP = this.string.indexOf(this.popen) + this.popen.length;
        let string1 = this.string.substr(0, SP);
        let string2 = this.string.substr(SP);
        let TP = string1.length + string2.indexOf(this.pclose);

        let word = (this.string.substring(this.last_sp, SP - this.popen.length)).trim();
        if (word !== '' && word !== null) {
            this.words.push(word);
            this.last_sp = SP - this.popen.length;

            this.parts.push(word);
        }

        if (TP + this.pclose.length < this.string.length) {
            this.last_words = (this.string.substring(TP + this.pclose.length)).trim();
        }

        return this.string.substring(SP, TP);
    }

    removeFromBetween() {
        if (this.string.indexOf(this.popen) < 0 || this.string.indexOf(this.pclose) < 0) return false;
        let removal = this.popen + this.getFromBetween(this.popen, this.pclose) + this.pclose;
        this.string = this.string.replace(removal, "");
    }

    getAllResults() {
        // first check to see if we do have both substrings
        if (this.string.indexOf(this.popen) < 0 || this.string.indexOf(this.pclose) < 0) return;

        // find one result
        let result = this.getFromBetween(this.popen, this.pclose);
        // push it to the results array
        this.placeholders.push(result);
        this.parts.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(this.popen, this.pclose);

        // if there's more substrings
        if (this.string.indexOf(this.popen) > -1 && this.string.indexOf(this.pclose) > -1) {
            this.getAllResults(this.popen, this.pclose);
        } else return;
    }

    process() {
        this.getAllResults();
        if (this.last_words !== this.words[this.words.length - 1]) {
            this.words.push(this.last_words);
            this.parts.push(this.last_words);
        }
    }

}