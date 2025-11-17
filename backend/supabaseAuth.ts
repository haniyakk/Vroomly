import { supabase } from "./supabaseClient";

export async function studentSignUp({ name, reg_no, email, department, password }) {
  try {
    // Step 1: create auth user
    const { data: auth, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { error: authError.message };
    }

    if (!auth.user) {
      return { error: 'Failed to create user' };
    }

    const auth_id = auth.user.id;

    // Step 2: insert student profile
    const { error: insertError } = await supabase.from("users").insert([
      {
        auth_id,
        name,
        email,
        user_type: "student",
        reg_no,
        department
      }
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { error: insertError.message };
    }

    console.log('Student signup successful for:', email);
    return { success: true };
  } catch (error) {
    console.error('Signup exception:', error);
    return { error: error.message };
  }
}

export async function driverSignUp({ name, cnic, email, password }) {
  try {
    // Step 1: create auth user
    const { data: auth, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { error: authError.message };
    }

    if (!auth.user) {
      return { error: 'Failed to create user' };
    }

    const auth_id = auth.user.id;

    // Step 2: insert driver profile
    const { error: insertError } = await supabase.from("users").insert([
      {
        auth_id,
        name,
        email,
        user_type: "driver",
        cnic
      }
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { error: insertError.message };
    }

    console.log('Driver signup successful for:', email);
    return { success: true };
  } catch (error) {
    console.error('Signup exception:', error);
    return { error: error.message };
  }
}

export async function login({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return { error: error.message };
    }

    if (!data.user) {
      return { error: 'No user found' };
    }

    const auth_id = data.user.id;
    console.log('Auth ID:', auth_id);

    // Fetch the user profile to see if they're student or driver
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", auth_id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { error: profileError.message };
    }

    if (!profile) {
      return { error: 'User profile not found' };
    }

    console.log('User profile:', profile);
    return { success: true, profile };
  } catch (error) {
    console.error('Login exception:', error);
    return { error: error.message };
  }
}
