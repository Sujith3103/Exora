function safeParse(value: any) {
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function normalizeError(err: any) {
    let message = err?.message || err?.msg || "unknown error";
    let code = err?.code || null;
    let status = err?.response?.status || err?.status || null;

    // 🔥 parse inner JSON if message is stringified JSON
    const parsed = safeParse(message);

    if (typeof parsed === "object") {
        message = parsed.message || message;
        status = parsed.response?.status || status;
        code = parsed.code || code;
    }

    return {
        message,
        code,
        status,
        raw: err
    };
}

export function classifyError(err: any) {
    console.log("classify -------------------------", err);

    const e = normalizeError(err); // ❌ NO JSON.parse here

    console.log("normalized error:", e);

    // if (!e.status) {
    //     return { type: "UNKNOWN", retry: true };
    // }

    // if (e.status >= 500) {
    //     return { type: "TRANSIENT", retry: true };
    // }

    // if (e.status >= 400) {
    //     return { type: "PERMANENT", retry: false };
    // }

    // return { type: "UNKNOWN", retry: true };
}

// {
//     message: "Request failed with status code 503",
//         response: {
//         status: 503,
//             data: "Service Unavailable"
//     }
// }