import { domain } from "./main.js";

export async function fetchUserProfile(token) {
  const query = `
    {
      user {
        # Basic Identification
        login
        attrs
        auditRatio
        
        # XP Data (for line graph)
        xpTransactions: transactions(
          where: {type: {_eq: "xp"}},
          order_by: {createdAt: asc}
        ) {
          amount
          createdAt
        }
        
        # Audit Data (for audit ratio pie chart)
        auditTransactions: transactions(
          where: {
            type: {_in: ["up", "down"]},
            eventId: {_eq: 75}
          }
        ) {
          type
          amount
        }
        
        # Project Data (for pass/fail pie chart)
        progresses(
          where: {
            object: {type: {_eq: "project"}},
            grade: { _is_null: false }
          },
          order_by: {createdAt: desc}
        ) {
          grade
          object {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${domain}/api/graphql-engine/v1/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();

    if (response.ok) {
      return result.data.user[0];
    } else {
      console.log("unexpected response: ", response.status)
    }

  } catch (error) {
    const app = document.getElementById('main-app')
    console.log(error)
    app.innerHTML = `
    <div class="error-page">
        <p class="error-page-text">${error.message}. Make sure you have a stable connection.</p>
        <p class="error-page-text">If you think the error is from us, please check back later.</p>
        <button class="err-btn pointer">Try again</button>
    </div>
    `
    document.querySelector('.err-btn').addEventListener('click', () => {
      window.location.reload()
    })
  }
}
