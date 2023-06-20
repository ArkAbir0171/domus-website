import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'



export default function Authentication({children}) {
    const session = useSession();
    const supabase = useSupabaseClient();
    if (!
        session) return (
        <div className="auth-container">
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="dark"
            />
        </div>
    )
    return (
        <>
            {children}
        </>
    )
}