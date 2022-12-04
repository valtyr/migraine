import { useCallback, useMemo, useState } from "react";
import { parseFile } from "@migraine/sqlite-parser/src/parser";
import { trpc } from "../utils/trpc";

export default function Web() {
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  const parsed = useMemo(() => {
    try {
      const parsed = parseFile(source);
      setError("");
      return parsed;
    } catch (e) {
      setError(String(e));
      return null;
    }
  }, [source]);

  const createPersonAndPet = trpc.test.createPersonAndPet.useMutation();

  const onRegister = useCallback(async () => {
    const res = await createPersonAndPet.mutateAsync();

    // const response = await navigator.credentials.create({
    //   publicKey: {
    //     user: {
    //       id: Uint8Array.from(username, (c) => c.charCodeAt(0)),
    //       displayName: username,
    //       name: username,
    //     },
    //     challenge: res.challenge,
    //     rp: {
    //       name: "Widgets",
    //       id: res.rpId,
    //     },
    //     attestation: res.attestation,
    //     extensions: res.extensions,
    //     timeout: res.timeout,
    //     pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    //   },
    // });

    // console.log(response);
  }, [createPersonAndPet]);

  return (
    <div className="space-x-4 flex flex-row">
      <textarea
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="font-mono border min-h-[500px] min-w-[400px] text-sm"
      />
      <pre className="text-xs">
        {error || JSON.stringify(parsed, undefined, 2)}
      </pre>
    </div>
  );
}
