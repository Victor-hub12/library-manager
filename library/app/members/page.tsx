import { Suspense } from "react";
import AddMemberForm from "../add-member-form";
import { getMembers } from "../../db";

async function MembersList() {
  const members = await getMembers();

  return (
    <section aria-label="Members">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
          All members
        </h2>
        <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-medium text-stone-700">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {members.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          No members yet. Add the first one above.
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {members.map((member) => (
            <li
              className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              key={member.id}
            >
              <h3 className="font-semibold text-stone-900">{member.name}</h3>
              <p className="text-sm text-stone-600">
                {member.phone || "No phone number"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MembersLoading() {
  return (
    <section
      aria-label="Loading members"
      aria-busy="true"
      className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500"
    >
      Loading members…
    </section>
  );
}

export default function MembersPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-5 py-12 sm:px-8 sm:py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Community library
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
          Members
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
          Manage the people who borrow books from the library.
        </p>
      </header>

      <AddMemberForm />

      <Suspense fallback={<MembersLoading />}>
        <MembersList />
      </Suspense>
    </main>
  );
}
