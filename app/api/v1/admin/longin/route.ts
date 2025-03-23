import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
    const { username, password } = await req.json();

	
    // Find user in the database
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the password
    const isValid = await compare(password, user.password);
    if (!isValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create session
    const session = await signIn('credentials', {
        redirect: false,
        username,
        password,
    });

    if (session?.error) {
        return NextResponse.json({ error: session.error }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
