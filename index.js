const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');

async function main() {
    try {
        await prisma.$connect();

        console.log("Prisma has been connected & dummy data has been created");

        // for (let i = 0; i < 20; i++) {
        //     const randomHashtags = Array.from(
        //         { length: Math.floor(Math.random() * 5) + 1 },
        //         () => faker.lorem.word()
        //     );

        //     await prisma.post.create({
        //         data: {
        //             content: faker.lorem.paragraph(),
        //             user: `user${i}`,
        //             hashtags: randomHashtags,
        //         },
        //     });
        // }
        // const posts = await prisma.post.findMany();
        // console.dir(posts, { depth: posts });

        await prisma.post.deleteMany();
        await prisma.searchResults.deleteMany();

        console.log("Dummy data has been deleted");

    } catch (error) {
        console.log(error);
        console.log("keys: ", Object.keys(error));
        console.log("error.errorCode: ", (error).errorCode);
        console.log("error.code: ", (error).code);
        console.error(JSON.stringify(error, null, 2));
    }
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
