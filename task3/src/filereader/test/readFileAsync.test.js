const fs = require('fs');
const { readFileAsync } = require('../readFileAsync');

describe('readFileAsync', () => {
    it("should return file content asynchronously", async () => {
        const filePath = "test.txt";

        // Write test file.
        const expectedContent = 'this is a test text in a test.txt file';
        fs.writeFileSync(filePath, expectedContent, 'utf-8');

        // Exec the function.
        let filePromise = readFileAsync(filePath);
        filePromise.catch(err => {
            console.log(`readFileAsync.catch: this should not be fired: ${err}`);
        })

        let fileContent = await filePromise;
        expect(fileContent).toBe(expectedContent);

        // clean test file.
        fs.unlinkSync(filePath);
    });

    it("should throw error when reading nonexistent file", async() => {
        const filePath = "notafile.txt";

        await expect(readFileAsync(filePath)).rejects.toThrow();
    })
})