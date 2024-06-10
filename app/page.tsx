"use client";

import { Fragment, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Roboto_Mono } from "next/font/google";
import { clsx } from "clsx";
import { useImmer } from "use-immer";

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
});

export default function Home() {
    const [isDual, setIsDual] = useState(false);
    const [n, setN] = useState(2);
    const [m, setM] = useState(3);
    const [LPType, setLPType] = useState<"max" | "min">("max");

    const [c, updateC] = useImmer<number[]>(Array.from({ length: n }).map(() => 0));
    const [A, updateA] = useImmer<number[][]>(
        Array.from({ length: m }).map(() => Array.from({ length: n }).map(() => 0)),
    );
    const [constraintTypes, updateConstraintTypes] = useImmer<Array<"leq" | "geq" | "eq">>(
        Array.from({ length: m }).map(() => "leq"),
    );
    const [b, updateB] = useImmer(Array.from({ length: m }).map(() => 0));
    const [variableBounds, updateVariableBounds] = useImmer(
        Array.from({ length: n }).map(() => "positive"),
    );

    return (
        <main className="container flex flex-col gap-3 overflow-scroll rounded-b-lg border-2 border-t-0 bg-card p-4 text-card-foreground">
            <h1 className="py-6 text-xl font-bold">Primal to dual converter</h1>
            <p>Enter the linear programming problem using the form</p>
            <div>
                <Button
                    className="bg-gradient-to-r from-primary to-ring"
                    onClick={() => {
                        console.log({ c, A, b, constraintTypes, variableBounds });
                        setM(n);
                        setN(m);
                        const newLPType = LPType === "max" ? "min" : "max";
                        setLPType(newLPType);
                        updateC(b);
                        updateB(c);
                        const AT = Array.from({ length: n }).map((_, i) =>
                            Array.from({ length: m }).map((_, j) => A[j][i]),
                        );
                        updateA(AT);
                        const newConstraintTypes = variableBounds.map((bound) => {
                            if (bound === "positive") return newLPType == "max" ? "leq" : "geq";
                            if (bound === "negative") return newLPType == "max" ? "geq" : "leq";
                            return "eq";
                        });
                        updateConstraintTypes(newConstraintTypes);
                        const newVariableBounds = constraintTypes.map((type) => {
                            if (type === "leq") return LPType == "max" ? "positive" : "negative";
                            if (type === "geq") return LPType == "min" ? "positive" : "negative";
                            return "urs";
                        });
                        updateVariableBounds(newVariableBounds);

                        setIsDual(!isDual);
                    }}>
                    Convert to dual
                </Button>
            </div>
            <p>
                Number of constraints:{" "}
                <Input
                    type="number"
                    value={m}
                    onChange={(e) => {
                        if (+e.target.value < 0) return;
                        if (+e.target.value < m) {
                            updateA((draft) => {
                                draft.length = +e.target.value;
                            });
                            updateConstraintTypes((draft) => {
                                draft.length = +e.target.value;
                            });
                            updateB((draft) => {
                                draft.length = +e.target.value;
                            });
                        } else {
                            updateA((draft) => {
                                for (let i = m; i < +e.target.value; i++) {
                                    draft.push(Array.from({ length: n }).map(() => 0));
                                }
                            });
                            updateConstraintTypes((draft) => {
                                for (let i = m; i < +e.target.value; i++) {
                                    draft.push("leq");
                                }
                            });
                            updateB((draft) => {
                                for (let i = m; i < +e.target.value; i++) {
                                    draft.push(0);
                                }
                            });
                        }

                        setM(+e.target.value);
                        if (e.target.value.startsWith("0") && e.target.value.length > 1)
                            e.target.value = e.target.value.slice(1);
                    }}
                    className="inline w-20 border-2"
                />
            </p>
            <p>
                Number of variables:{" "}
                <Input
                    type="number"
                    value={n}
                    onChange={(e) => {
                        if (+e.target.value < 0) return;
                        if (+e.target.value < n) {
                            updateC((draft) => {
                                draft.length = +e.target.value;
                            });
                            updateA((draft) => {
                                draft.forEach((row) => {
                                    row.length = +e.target.value;
                                });
                            });
                            updateVariableBounds((draft) => {
                                draft.length = +e.target.value;
                            });
                        } else {
                            updateC((draft) => {
                                for (let i = n; i < +e.target.value; i++) {
                                    draft.push(0);
                                }
                            });
                            updateA((draft) => {
                                for (let i = n; i < +e.target.value; i++) {
                                    draft.forEach((row) => {
                                        row.push(0);
                                    });
                                }
                            });
                            updateVariableBounds((draft) => {
                                for (let i = n; i < +e.target.value; i++) {
                                    draft.push("positive");
                                }
                            });
                        }
                        setN(+e.target.value);
                        if (e.target.value.startsWith("0") && e.target.value.length > 1)
                            e.target.value = e.target.value.slice(1);
                    }}
                    className="inline w-20 border-2"
                />
            </p>
            <p className="my-auto">Objective function:</p>
            <div className="flex flex-row gap-2">
                <Select value={LPType} onValueChange={(e) => setLPType(e as "max" | "min")}>
                    <SelectTrigger className="max-w-20 border-2">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="max">max</SelectItem>
                        <SelectItem value="min">min</SelectItem>
                    </SelectContent>
                </Select>
                <p className={clsx("my-auto", roboto_mono.className)}>{isDual ? "w" : "z"}=</p>
                {Array.from({ length: n }).map((_, i) => (
                    <Fragment key={i}>
                        <Input
                            type="number"
                            className="min-w-16 max-w-20 border-2"
                            value={+c[i]}
                            onChange={(e) =>
                                updateC((draft) => {
                                    draft[i] = +e.target.value;
                                    if (e.target.value.startsWith("0") && e.target.value.length > 1)
                                        e.target.value = e.target.value.slice(1);
                                })
                            }
                        />
                        <p
                            className={clsx(
                                "my-auto",
                                roboto_mono.className,
                                i >= 9 ? "min-w-[5ch]" : "min-w-[4ch]",
                            )}>
                            {isDual ? "y" : "x"}
                            {i + 1}
                            {i < n - 1 ? " +" : " "}
                        </p>
                    </Fragment>
                ))}
            </div>
            <div className="flex max-w-[60%] flex-col gap-2">
                {Array.from({ length: m }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                        {Array.from({ length: n }).map((_, j) => (
                            <Fragment key={j}>
                                <Input
                                    type="number"
                                    className="min-w-16 max-w-20 border-2"
                                    value={Number(A[i][j])}
                                    onChange={(e) =>
                                        updateA((draft) => {
                                            draft[i][j] = +e.target.value;
                                            // make sure the shows value does not have leading zeroes
                                            if (
                                                e.target.value.startsWith("0") &&
                                                e.target.value.length > 1
                                            )
                                                e.target.value = e.target.value.slice(1);
                                        })
                                    }
                                />
                                <p
                                    className={clsx(
                                        "my-auto",
                                        roboto_mono.className,
                                        j >= 9
                                            ? j < n - 1
                                                ? "min-w-[5ch]"
                                                : "min-w-[3ch]"
                                            : j < n - 1
                                              ? "min-w-[4ch]"
                                              : "min-w-[2ch]",
                                    )}>
                                    {isDual ? "y" : "x"}
                                    {j + 1}
                                    {j < n - 1 ? " +" : " "}
                                </p>
                            </Fragment>
                        ))}
                        <Select
                            value={constraintTypes[i]}
                            onValueChange={(e) =>
                                updateConstraintTypes((draft) => {
                                    draft[i] = e as "leq" | "geq" | "eq";
                                })
                            }>
                            <SelectTrigger className="min-w-14 max-w-14 border-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="leq">≤</SelectItem>
                                <SelectItem value="geq">≥</SelectItem>
                                <SelectItem value="eq">=</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            className="min-w-16 max-w-20 border-2"
                            value={b[i]}
                            onChange={(e) => {
                                updateB((draft) => {
                                    draft[i] = +e.target.value;
                                });
                                if (e.target.value.startsWith("0") && e.target.value.length > 1)
                                    e.target.value = e.target.value.slice(1);
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-2">
                {Array.from({ length: n }).map((_, i) => (
                    <Fragment key={i}>
                        <p className="my-auto">
                            {i > 0 ? "," : ""}x{i + 1}
                        </p>
                        <Select
                            value={variableBounds[i]}
                            onValueChange={(e) =>
                                updateVariableBounds((draft) => {
                                    draft[i] = e;
                                })
                            }>
                            <SelectTrigger className="w-[4.5rem] min-w-[4.5rem] border-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="positive">≥ 0</SelectItem>
                                <SelectItem value="negative">≤ 0</SelectItem>
                                <SelectItem value="urs">urs</SelectItem>
                            </SelectContent>
                        </Select>
                    </Fragment>
                ))}
            </div>
        </main>
    );
}
