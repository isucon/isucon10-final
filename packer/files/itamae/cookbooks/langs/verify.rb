execute "verify ~isucon/local binary dyld" do
  command "( find ~isucon/local/ -name '*.so' -print0; find ~isucon/local/ -executable -print0 ) | xargs -0 -P $(nproc) -n1 bash -c \"" \
    " if echo $1 | grep -q '/local/rust/'; then continue; fi;" \
    " if ldd $1 2>&1 | grep 'not found'; then" \
    "   echo $1; exit 1;" \
    " fi\""

  user 'isucon'
end
