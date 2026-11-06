import { Suspense } from "react";
import AddMemberForm from "../add-member-form";
import { getMembers } from "../../db";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

async function MembersDashboard() {
  const members = await getMembers();

  return (
    <>
      <div className="members-layout">
        <section aria-label="Members directory" className="collection-column">
          <div className="collection-heading">
            <h2>Our readers</h2>
            <span className="count-label">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>

          {members.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true" className="empty-state-mark">♙</span>
              <p>
                Your library community starts here. Add the first member to
                welcome them in.
              </p>
            </div>
          ) : (
            <ul className="member-grid">
              {members.map((member, index) => (
                <li className="member-card" key={member.id}>
                  <span
                    aria-hidden="true"
                    className={`member-avatar avatar-${(index % 5) + 1}`}
                  >
                    {getInitials(member.name)}
                  </span>
                  <div className="member-details">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-contact">
                      {member.phone || "Phone not provided"}
                    </p>
                  </div>
                  <span aria-hidden="true" className="member-card-arrow">↗</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside aria-label="Add a member" className="members-sidebar">
          <AddMemberForm />
          <div className="tip-card member-tip">
            <span aria-hidden="true">✦</span>
            <p>
              A shared love of reading brings neighbors a little closer.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function MembersLoading() {
  return (
    <div aria-busy="true" className="loading-card">
      Gathering the community…
    </div>
  );
}

export default function MembersPage() {
  return (
    <main className="members-catalog-main">
      <header className="catalog-title-row members-title-row">
        <div className="catalog-title-wrap">
          <h1>Members</h1>
          <span className="catalog-title-chevron">›</span>
        </div>
      </header>
      <Suspense fallback={<MembersLoading />}>
        <MembersDashboard />
      </Suspense>
    </main>
  );
}
