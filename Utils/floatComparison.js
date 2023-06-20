function isEqualFloat(f1, f2)
{
    let difference =  Math.abs(f1 - f2);
    return difference < Number.EPSILON;
}
export {
    isEqualFloat
}